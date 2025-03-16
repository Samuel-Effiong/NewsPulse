from typing import Any, Dict

from django.db.models import Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.views import APIView

from .models import News, NewsImage, Tag
from .serializers import NewsImageSerializer, NewsSerializer, TagsSerializer


class CustomPagination(PageNumberPagination):
    """Custom pagination class for News"""

    page_size: int = 3
    page_size_query_param: str = "page_size"
    max_page_size: int = 100


# Create your views here.
class NewsViewSet(viewsets.ModelViewSet):  # type: ignore
    """
    A viewset that provides `list`, `retrieve`, `create` and `delete`
    actions for News articles. It also includes custom actions for liking
    and disliking news.
    """

    queryset = News.objects.all().exclude(status="Draft")
    serializer_class = NewsSerializer
    pagination_class = CustomPagination

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


class TagViewSet(viewsets.ModelViewSet):  # type: ignore
    queryset = Tag.objects.all()
    serializer_class = TagsSerializer
    pagination_class = CustomPagination


class ImageViewSet(viewsets.ModelViewSet):  # type: ignore
    queryset = NewsImage.objects.all()
    serializer_class = NewsImageSerializer
    pagination_class = CustomPagination


class StatsAPIView(APIView):
    """
    API view to return site-wide statistics

    This endpoint returns:
        - total_news: Total number of news articles.
        - total_likes: Sum of all likes received by news articles
        - total_dislikes: Sum of all disliked received by news articles
    """

    def get(self, request: Any, format: Any = None) -> Response:

        news_object = News.objects.exclude(status="Draft")

        # Total number of published news articles
        total_news: int = news_object.count()

        # Aggregate total likes from all news article; if None, default to 0
        likes_agg: Dict[str, Any] = news_object.aggregate(total_likes=Sum("like_count"))
        total_likes: int = likes_agg.get("total_likes") or 0

        # Aggregate total dislikes from all news articles; if None, default to 0
        dislikes_agg: Dict[str, Any] = news_object.aggregate(total_dislikes=Sum("dislike_count"))
        total_dislikes: int = dislikes_agg.get("total_dislikes") or 0

        # Prepare the response data dictionary
        data: Dict[str, int] = {
            "total_news": total_news,
            "total_likes": total_likes,
            "total_dislikes": total_dislikes,
        }

        # Return the response with a 200 OK status
        return Response(data, status=status.HTTP_200_OK)
