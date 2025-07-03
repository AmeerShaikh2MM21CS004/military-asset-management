# users/signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from assets.models import Base

User = get_user_model()

@receiver(post_migrate)
def create_default_users(sender, **kwargs):
    if User.objects.filter(username="admin").exists():
        return  

    default_base = Base.objects.first() or Base.objects.create(name="Default Base")

    User.objects.create_superuser(username="admin", password="admin123", role="admin")
    User.objects.create_user(username="commander", password="commander123", role="commander", base=default_base)
    User.objects.create_user(username="officer", password="officer123", role="officer", base=default_base)
