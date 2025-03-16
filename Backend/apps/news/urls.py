from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NewsViewSet, StatsAPIView

router = DefaultRouter()
router.register("news", NewsViewSet, basename="news")


urlpatterns = [
    path("", include(router.urls)),
    path("stats/", StatsAPIView.as_view(), name="stats"),
]
