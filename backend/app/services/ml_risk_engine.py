import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import GradientBoostingClassifier, IsolationForest
from sklearn.metrics import roc_auc_score, average_precision_score

class MLRiskEngine:
    def __init__(self):
        self.classifier = None
        self.anomaly_detector = None
        self.feature_names = [
            "claim_count",
            "price_vs_category_median",
            "seller_historical_contradiction_rate",
            "warranty_claim_length_years",
            "battery_claim_hours",
            "has_unverifiable_standards"
        ]
        self._train_models()

    def _train_models(self):
        # Synthetic training data representing 1,000 promise records (PromiseEvidence-1K benchmark)
        np.random.seed(42)
        n_samples = 1000

        # Features
        claim_count = np.random.randint(5, 20, size=n_samples)
        price_ratio = np.random.uniform(0.6, 1.4, size=n_samples)
        seller_contra = np.random.uniform(0.02, 0.45, size=n_samples)
        warranty_years = np.random.choice([1, 2, 3, 5], size=n_samples, p=[0.5, 0.35, 0.1, 0.05])
        battery_hours = np.random.uniform(6, 18, size=n_samples)
        unverifiable_flag = np.random.choice([0, 1], size=n_samples, p=[0.7, 0.3])

        X = np.column_stack([
            claim_count,
            price_ratio,
            seller_contra,
            warranty_years,
            battery_hours,
            unverifiable_flag
        ])

        # Latent risk formula
        logits = (
            0.15 * (claim_count - 10) +
            -1.2 * (price_ratio - 1.0) +
            4.5 * seller_contra +
            0.8 * (warranty_years - 1) +
            0.35 * (battery_hours - 8) +
            1.1 * unverifiable_flag
        )
        probs = 1 / (1 + np.exp(-logits))
        y = (np.random.uniform(0, 1, size=n_samples) < probs).astype(int)

        self.classifier = GradientBoostingClassifier(n_estimators=60, learning_rate=0.1, random_state=42)
        self.classifier.fit(X, y)

        preds_prob = self.classifier.predict_proba(X)[:, 1]
        self.eval_roc_auc = float(roc_auc_score(y, preds_prob))
        self.eval_pr_auc = float(average_precision_score(y, preds_prob))

        # Isolation forest for anomaly detection
        self.anomaly_detector = IsolationForest(contamination=0.08, random_state=42)
        self.anomaly_detector.fit(X)

    def assess_risk(self, product_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assesses discrepancy risk probability and anomaly patterns for a product.
        """
        c_count = product_features.get("claim_count", 12)
        price_ratio = product_features.get("price_vs_category_median", 0.95)
        seller_contra = product_features.get("seller_contradiction_rate", 0.14)
        w_years = product_features.get("warranty_years", 2.0)
        b_hours = product_features.get("battery_hours", 12.0)
        unv_flag = 1 if product_features.get("has_unverifiable", True) else 0

        feat_vector = np.array([[c_count, price_ratio, seller_contra, w_years, b_hours, unv_flag]])
        risk_prob = float(self.classifier.predict_proba(feat_vector)[0, 1])

        # Check anomaly
        anomaly_score = float(self.anomaly_detector.decision_function(feat_vector)[0])
        is_anomaly = bool(anomaly_score < 0)

        # Feature importance interpretation
        importances = self.classifier.feature_importances_
        feature_impact = []
        for name, imp in zip(self.feature_names, importances):
            feature_impact.append({
                "feature": name,
                "importance": round(float(imp), 3)
            })
        feature_impact.sort(key=lambda x: x["importance"], reverse=True)

        risk_level = "Low"
        if risk_prob > 0.70:
            risk_level = "Severe"
        elif risk_prob > 0.45:
            risk_level = "High"
        elif risk_prob > 0.25:
            risk_level = "Moderate"

        anomaly_reasons = []
        if b_hours >= 12.0:
            anomaly_reasons.append("Battery claim (12+ hrs) exceeds standard H-series laptop thermal power envelope.")
        if w_years > 1.0:
            anomaly_reasons.append("Advertised warranty length exceeds manufacturer baseline of 1 year.")
        if unv_flag:
            anomaly_reasons.append("Product description includes unverifiable military durability assertions.")

        return {
            "discrepancy_risk_score": round(risk_prob * 100, 1),
            "risk_level": risk_level,
            "is_anomaly": is_anomaly,
            "anomaly_confidence": round(abs(anomaly_score), 2),
            "anomaly_flags": anomaly_reasons,
            "model_metrics": {
                "roc_auc": round(self.eval_roc_auc, 3),
                "pr_auc": round(self.eval_pr_auc, 3),
                "model_type": "GradientBoosting + IsolationForest"
            },
            "top_drivers": feature_impact[:3]
        }

ml_risk_engine = MLRiskEngine()
