from typing import Any

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from .models import News
from .serializers import NewsSerializer


# Create your views here.
class NewsViewSet(viewsets.ModelViewSet):  # type: ignore
    """
    A viewset that provides `list`, `retrieve`, `create` and `delete`
    actions for News articles. It also includes custom actions for liking
    and disliking news.
    """

    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self) -> Any:
        """
        Optionally restricts the returned news to a given tag, by filtering
        against a `tag` query parameter in the URL
        :return:
        """

        queryset = super().get_queryset()
        tag: Any = self.request.query_params.get("tag", None)

        if tag is not None:
            queryset = queryset.filter(tags__name=tag)
        return queryset

    @action(detail=True, methods=["post"])
    def like(self, request: Any, pk: Any = None) -> Response:
        """Custom action to add a like to the news item"""
        news: News = self.get_object()
        news.add_like()
        serializer: BaseSerializer[Any] = self.get_serializer(news)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def dislike(self, request: Any, pk: Any = None) -> Response:
        """Custom action to add a dislike to the news item"""
        news: News = self.get_object()
        news.add_dislike()
        serializer: BaseSerializer[Any] = self.get_serializer(news)
        return Response(serializer.data, status=status.HTTP_200_OK)
