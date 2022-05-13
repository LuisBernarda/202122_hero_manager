# Note: all these commands refer to the /kubernetes folder
# If you intend to run in the project root folder,
#   you need to add the prefix deployment/kubernetes/ on the -f parameters

# Build all services' images
docker-compose build -f docker-compose.yaml

# Build just one service image
docker-compose build hero_manager_frontend
docker-compose build hero_manager_backend
docker-compose build hero_manager_marvel
docker-compose build hero_manager_statistics
docker-compose build hero_manager_scheduler

# Load images to the control plane
kind load docker-image hero_manager_frontend_image
kind load docker-image hero_manager_backend_image
kind load docker-image hero_manager_marvel_image
kind load docker-image hero_manager_statistics_image
kind load docker-image hero_manager_scheduler_image

# Create deployments and services
kubectl apply -f frontend/frontend.deployment.yaml
kubectl apply -f frontend/frontend.service.yaml
kubectl apply -f backend/backend.deployment.yaml
kubectl apply -f backend/backend.service.yaml
kubectl apply -f database/database.deployment.yaml
kubectl apply -f database/database.service.yaml
kubectl apply -f marvel/marvel.deployment.yaml
kubectl apply -f marvel/marvel.service.yaml
kubectl apply -f scheduler/scheduler.deployment.yaml
kubectl apply -f scheduler/scheduler.service.yaml
kubectl apply -f statistics/statistics.deployment.yaml
kubectl apply -f statistics/statistics.service.yaml

# Port forward our localhost ports to the NodePorts services
kubectl port-forward service/hero-manager-frontend 8080
kubectl port-forward service/hero-manager-backend 8081
kubectl port-forward service/hero-manager-marvel 8082
kubectl port-forward service/hero-manager-statistics 8083
kubectl port-forward service/hero-manager-database 27017

# Example to Rebuild image
docker-compose build --no-cache hero_manager_frontend
kind load docker-image hero_manager_frontend_image
kubectl get pods # Note the frontend pod name!
kubectl delete pod <pod_name>

# Example when making changes in deployment/services
kubectl apply -f frontend/frontend.deployment.yaml
## Restart port-forwarding:
kubectl port-forward service/hero-manager-frontend 8080
