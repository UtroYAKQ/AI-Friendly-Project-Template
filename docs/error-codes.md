# Error Codes

Use stable machine-readable error codes. Do not change existing meanings without a migration plan.

| Code | HTTP | Meaning | Client Action |
| --- | --- | --- | --- |
| `VALIDATION_ERROR` | 422 | Request input failed validation | Show field-level message |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication | Ask user to sign in |
| `FORBIDDEN` | 403 | User cannot access this resource | Hide or disable action |
| `NOT_FOUND` | 404 | Route or generic resource does not exist | Show not found state |
| `TODO_NOT_FOUND` | 404 | Todo does not exist or is inaccessible | Remove stale item from UI |
| `CONFLICT` | 409 | Request conflicts with current state | Refresh and retry |
| `RATE_LIMITED` | 429 | Too many requests | Retry later |
| `INTERNAL_ERROR` | 500 | Unexpected server failure | Show generic error and log request id |

## Error Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": { "field": "title" }
  },
  "meta": { "requestId": "req_003" }
}
```
