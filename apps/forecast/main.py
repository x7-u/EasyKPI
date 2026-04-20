"""
Phase 3.5 forecast sidecar — FastAPI + statsmodels (Prophet optional).

Runs alongside apps/api. The main Node API proxies `/forecast` requests here
when a workspace has the Prophet feature flag enabled, preserving the same
request/response contract so the React client stays agnostic.

Run locally:
  pip install fastapi uvicorn statsmodels
  uvicorn apps.forecast.main:app --port 8788
"""
from __future__ import annotations

import os
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

try:
    from statsmodels.tsa.holtwinters import ExponentialSmoothing  # type: ignore
except ImportError:
    ExponentialSmoothing = None  # type: ignore

try:
    from prophet import Prophet  # type: ignore
except ImportError:
    Prophet = None  # type: ignore


app = FastAPI(title="EasyKPI forecast sidecar", version="0.1.0")


class SeriesPoint(BaseModel):
    period: str
    value: float


class ForecastRequest(BaseModel):
    series: List[SeriesPoint]
    horizon: int = 6
    confidence: float = 0.8
    method: Optional[str] = None  # "prophet" | "holt-winters"


class ForecastResponse(BaseModel):
    points: List[SeriesPoint]
    low: List[SeriesPoint]
    high: List[SeriesPoint]
    method: str
    confidence: float


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "prophet": Prophet is not None,
        "holt_winters": ExponentialSmoothing is not None,
    }


def _holt_winters_fallback(req: ForecastRequest) -> ForecastResponse:
    vals = [p.value for p in req.series]
    if not vals:
        return ForecastResponse(points=[], low=[], high=[], method="naive", confidence=req.confidence)
    last = vals[-1]
    trend = (vals[-1] - vals[0]) / max(len(vals) - 1, 1)
    return ForecastResponse(
        points=[SeriesPoint(period=f"t+{i+1}", value=last + trend * (i + 1)) for i in range(req.horizon)],
        low=[SeriesPoint(period=f"t+{i+1}", value=last + trend * (i + 1) - abs(trend)) for i in range(req.horizon)],
        high=[SeriesPoint(period=f"t+{i+1}", value=last + trend * (i + 1) + abs(trend)) for i in range(req.horizon)],
        method="naive",
        confidence=req.confidence,
    )


@app.post("/forecast", response_model=ForecastResponse)
def forecast(req: ForecastRequest) -> ForecastResponse:
    if req.method == "prophet" and Prophet is not None:
        import pandas as pd  # type: ignore

        df = pd.DataFrame(
            [
                {"ds": _parse_period(p.period, i), "y": p.value}
                for i, p in enumerate(req.series)
            ]
        )
        m = Prophet(interval_width=req.confidence)
        m.fit(df)
        future = m.make_future_dataframe(periods=req.horizon)
        fc = m.predict(future).tail(req.horizon)
        return ForecastResponse(
            points=[SeriesPoint(period=str(r["ds"].date()), value=float(r["yhat"])) for _, r in fc.iterrows()],
            low=[SeriesPoint(period=str(r["ds"].date()), value=float(r["yhat_lower"])) for _, r in fc.iterrows()],
            high=[SeriesPoint(period=str(r["ds"].date()), value=float(r["yhat_upper"])) for _, r in fc.iterrows()],
            method="prophet",
            confidence=req.confidence,
        )
    if ExponentialSmoothing is not None and len(req.series) >= 4:
        vals = [p.value for p in req.series]
        fit = ExponentialSmoothing(vals, trend="add").fit()
        proj = fit.forecast(req.horizon)
        resid = (sum((a - b) ** 2 for a, b in zip(vals, fit.fittedvalues)) / max(len(vals) - 1, 1)) ** 0.5
        z = 1.96 if req.confidence >= 0.95 else 1.28
        margin = z * resid
        return ForecastResponse(
            points=[SeriesPoint(period=f"t+{i+1}", value=float(v)) for i, v in enumerate(proj)],
            low=[SeriesPoint(period=f"t+{i+1}", value=float(v) - margin) for i, v in enumerate(proj)],
            high=[SeriesPoint(period=f"t+{i+1}", value=float(v) + margin) for i, v in enumerate(proj)],
            method="holt-winters",
            confidence=req.confidence,
        )
    return _holt_winters_fallback(req)


def _parse_period(s: str, i: int) -> datetime:
    try:
        return datetime.strptime(s, "%Y-%m")
    except Exception:
        return datetime.utcfromtimestamp(i * 86400 * 30)
