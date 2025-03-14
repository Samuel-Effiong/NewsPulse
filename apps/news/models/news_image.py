from typing import Any, List, Optional

from django.db import models

# from .news import News


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
        upload_to="news_images/",
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
