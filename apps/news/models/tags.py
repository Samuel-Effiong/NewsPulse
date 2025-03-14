from typing import Any, List, Optional

from django.db import models


class Tag(models.Model):
    """Model to represent a Tag used for categorizing news articles"""

    name = models.CharField(
        max_length=50, unique=True, verbose_name="Tag Name", help_text="Unique tag for news category"
    )

    class Meta:
        verbose_name: str = "Tag"
        verbose_name_plural: str = "Tags"
        ordering: List[str] = [
            "name",
        ]

    def __str__(self) -> str:
        return str(self.name)
