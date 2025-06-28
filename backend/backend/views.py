# views.py (Django backend)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from assets.models import Purchase, Transfer, Assignment, Expenditure, Asset
from assets.serializers import PurchaseSerializer, TransferSerializer, AssignmentSerializer, ExpenditureSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    opening_balance = Asset.objects.aggregate_total('opening_balance')
    closing_balance = Asset.objects.aggregate_total('closing_balance')
    purchases_total = Purchase.objects.aggregate_total('quantity')
    transfer_in_total = Transfer.objects.filter(to_base=request.user.base).aggregate_total('quantity')
    transfer_out_total = Transfer.objects.filter(from_base=request.user.base).aggregate_total('quantity')
    net_movement = purchases_total + transfer_in_total - transfer_out_total
    assigned = Assignment.objects.aggregate_total('quantity')
    expended = Expenditure.objects.aggregate_total('quantity')

    return Response({
        "opening_balance": opening_balance,
        "closing_balance": closing_balance,
        "net_movement": net_movement,
        "assigned": assigned,
        "expended": expended,
        "details": {
            "purchases": purchases_total,
            "transfer_in": transfer_in_total,
            "transfer_out": transfer_out_total
        }
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def purchases_view(request):
    if request.method == 'GET':
        purchases = Purchase.objects.all()
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PurchaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def transfers_view(request):
    if request.method == 'GET':
        transfers = Transfer.objects.all()
        serializer = TransferSerializer(transfers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TransferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_asset(request):
    serializer = AssignmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def expend_asset(request):
    serializer = ExpenditureSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
