from typing import Dict, List, Sequence, Tuple

from django.contrib import admin
from django.db.models.fields.related_descriptors import ManyToManyDescriptor

from .models import News, NewsImage, Tag

# Register your models here.


class NewsImageInline(admin.TabularInline):  # type: ignore
    model = NewsImage
    extra: int = 3
    fields: Tuple[str, ...] = ("image", "caption")
    verbose_name: str = "Associated Image"
    verbose_name_plural: str = "Associated Images"


class TagInline(admin.TabularInline):  # type: ignore
    model = News.tags.through
    extra: int = 2
    verbose_name: str = "Tag"
    verbose_name_plural: str = "Tags"
    autocomplete_fields: Tuple[str, ...] = ("tag",)


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):  # type: ignore
    list_display: Tuple[str, ...] = (
        "title",
        "slug",
        "status",
        "published_at",
        "view_count",
    )
    list_filter: Tuple[str, ...] = ("tags", "status", "published_at")
    search_fields: Tuple[str, ...] = ("title", "content", "tags__name")
    prepopulated_fields: Dict[str, Sequence[str]] = {"slug": ["title"]}
    inlines: list[type] = [NewsImageInline, TagInline]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):  # type: ignore
    list_display: Tuple[str, ...] = ("name",)
    search_fields: Tuple[str, ...] = ("name",)
