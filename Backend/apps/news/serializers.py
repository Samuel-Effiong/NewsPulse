from typing import List

from drf_writable_nested import WritableNestedModelSerializer
from rest_framework import serializers

from .models import News, NewsImage, Tag


class TagsSerializer(serializers.ModelSerializer):  # type: ignore
    class Meta:
        model = Tag
        fields: List[str] = ["id", "name"]


class NewsImageSerializer(serializers.ModelSerializer):  # type: ignore
    class Meta:
        model = NewsImage
        fields: List[str] = ["id", "image", "caption"]


class NewsSerializer(WritableNestedModelSerializer):  # type: ignore
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)
    images = NewsImageSerializer(many=True, read_only=True)

    class Meta:
        model = News
        fields: List[str] = [
            "id",
            "title",
            "content",
            "slug",
            "featured_image",
            "published_at",
            "created_at",
            "updated_at",
            "view_count",
            "like_count",
            "dislike_count",
            "tags",
            "images",
        ]
        read_only_fields = ["created_at", "updated_at", "view_count", "like_count", "dislike_count"]
