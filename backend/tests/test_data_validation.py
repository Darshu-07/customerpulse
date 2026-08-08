import pytest
from app.services.data_ingestion import validate_required_fields
import pandas as pd

def test_validate_required_fields():
    df = pd.DataFrame({"a": [1], "b": [2]})
    missing = validate_required_fields(df, ["a", "c"])
    assert missing == ["c"]
