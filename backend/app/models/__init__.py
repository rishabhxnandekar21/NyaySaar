# This file makes the folder a Python package
# You can also expose models here for easier imports

from .request import QueryRequest
from .response import QueryResponse

__all__ = ["QueryRequest", "QueryResponse"]