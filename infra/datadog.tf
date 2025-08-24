terraform {
  required_providers {
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.0"
    }
  }
}

provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
}

resource "datadog_monitor" "high_error_rate" {
  name    = "High error rate"
  type    = "query alert"
  query   = "avg(last_5m):sum:latestos.request.errors{*} > 5"
  message = "High error rate detected. Notify @slack-#incidents"
  tags    = ["service:latestos"]
}

resource "datadog_monitor" "high_latency" {
  name    = "High latency"
  type    = "query alert"
  query   = "avg(last_5m):p95:latestos.request.duration{*} > 300"
  message = "Latency above SLO. Notify @slack-#incidents"
  tags    = ["service:latestos"]
}

resource "datadog_dashboard_json" "service_overview" {
  dashboard = <<JSON
{
  "title": "Latest OS Service Overview",
  "widgets": [
    {
      "definition": {
        "type": "timeseries",
        "requests": [
          {
            "q": "sum:latestos.request.count{*}",
            "display_type": "line"
          }
        ]
      }
    },
    {
      "definition": {
        "type": "timeseries",
        "requests": [
          {
            "q": "avg:latestos.request.duration{*}",
            "display_type": "line"
          }
        ]
      }
    },
    {
      "definition": {
        "type": "timeseries",
        "requests": [
          {
            "q": "sum:latestos.request.errors{*}",
            "display_type": "line"
          }
        ]
      }
    }
  ]
}
JSON
}
