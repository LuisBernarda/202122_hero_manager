data "google_container_registry_repository" "meicm_registry" {}

output "gcr_location" {
    value = "${data.google_container_registry_repository.meicm_registry.repository_url}"
}
