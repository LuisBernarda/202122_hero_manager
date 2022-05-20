output "location" {
  value       = var.location
}

output "region" {
  value       = var.region
}

output "project_id" {
  value       = var.project_id
}

output "kubernetes_cluster_name" {
  value       = google_container_cluster.meicm.name
}
