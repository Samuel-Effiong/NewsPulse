import os
from typing import Any, Dict, List

from django.db import models
from django.utils.text import slugify


def news_featured_image_path(instance: "News", filename: str) -> str:
    """
    Construct a dynamic upload path for the featured image.
    The image will be stored in a folder named after the news article's slug.
    If the slug is not set, we use a slugified version of the title.
    """

    folder_name = instance.slug if instance.slug else slugify(instance.title)
    return os.path.join(folder_name, "featured_image", filename)


STATUS_CHOICES = (("Draft", "Draft"), ("Published", "Published"))


class News(models.Model):
    """Model to represent a News article"""

    title = models.CharField(max_length=255, verbose_name="Title", help_text="Enter the title of the news article")
    content = models.TextField(verbose_name="Content", help_text="Enter the full text of the news article")
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Created At", help_text="The date and time when the news article was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name="Updated At", help_text="The date and time when the news article was last updated"
    )
    published_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Published At",
        help_text="The date and time when the news article was published",
    )
    status = models.CharField(
        max_length=20, default="Draft", choices=STATUS_CHOICES, help_text="The current status of the news item"
    )

    view_count = models.PositiveIntegerField(
        default=0, verbose_name="View Count", help_text="Number of likes recieved by the news article"
    )
    like_count = models.PositiveIntegerField(
        default=0, verbose_name="Like Count", help_text="Number of likes received by the news article."
    )
    dislike_count = models.PositiveIntegerField(
        default=0, verbose_name="Dislike Count", help_text="Number of dislikes received by the news article."
    )
    tags = models.ManyToManyField(
        "Tag", related_name="news", verbose_name="Tags", help_text="Tags associated with this news article."
    )
    slug = models.SlugField(max_length=220, unique=True, help_text="SEO-friendly URL identifier")
    featured_image = models.ImageField(
        upload_to=news_featured_image_path,
        verbose_name="Image",
        help_text="Upload the featured image for the news article",
    )

    class Meta:
        verbose_name: str = "News"
        verbose_name_plural: str = "News"
        ordering: List[str] = ["-created_at"]
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["published_at"])]

    def __str__(self) -> str:
        return str(self.title)

    def get_absolute_url(self) -> None:
        return

    def increment_view_count(self) -> None:
        """Increment the view count by one"""
        self.view_count += 1
        self.save(update_fields=["view_count"])

    def add_like(self) -> None:
        """Increment the like count by one"""
        self.like_count += 1
        self.save(update_fields=["like_count"])

    def add_dislike(self) -> None:
        """Increment the dislike count by one"""
        self.dislike_count += 1
        self.save(update_fields=["dislike_count"])
