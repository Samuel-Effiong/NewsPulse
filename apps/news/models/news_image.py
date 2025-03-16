import os
from typing import Any, List, Optional

from django.db import models
from django.utils.text import slugify

# from .news import News


def news_image_upload_path(instance: "NewsImage", filename: str) -> str:
    """
    Construct a dynamic upload path for the news image.
    The image will be stored in a folder named after the related news article's slug.
    If the news article's slug is not set, it will use a slugified version of the news title.
    """

    # Access the related news article's slug or slugify its title.
    news_slug = instance.news.slug if instance.news.slug else slugify(instance.news.title)
    return os.path.join(news_slug, filename)


class NewsImage(models.Model):
    """Model to represent images associated with a News article"""

    news = models.ForeignKey(
        "News",
        related_name="images",
        on_delete=models.CASCADE,
        verbose_name="News Article",
        help_text="The news article this image belongs to",
    )
    image = models.ImageField(
        upload_to=news_image_upload_path,
        verbose_name="Image",
        help_text="Upload an image for the news article",
    )
    caption = models.CharField(
        max_length=255, blank=True, null=True, verbose_name="Caption", help_text="Optional caption for the image"
    )

    class Meta:
        verbose_name: str = "News Image"
        verbose_name_plural: str = "News Images"

    def __str__(self) -> str:
        return f"Image for {self.news.title}"
