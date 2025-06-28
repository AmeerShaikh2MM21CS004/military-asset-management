from django.urls import path
from .views import login_view, logout_view, get_user, get_csrf_token

urlpatterns = [
    path("login/", login_view),
    path("logout/", logout_view),
    path("user/", get_user),
    path("csrf/", get_csrf_token),
]
