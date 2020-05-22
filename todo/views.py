from django.shortcuts import render, redirect
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Task

from .serializers import TaskSerializer

@api_view(['GET'])
def displayOptions(request):
    return Response({
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/'
    })


@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    ser = TaskSerializer(tasks, many=True)

    return Response(ser.data)



@api_view(['GET'])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    ser = TaskSerializer(tasks, many=False)

    return Response(ser.data)


@api_view(['POST'])
def taskCreate(request):
    ser = TaskSerializer(data=request.data)

    if ser.is_valid():
        ser.save()

    return Response(ser.data)


@api_view(['POST'])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    ser = TaskSerializer(instance=task, data=request.data)
    if ser.is_valid():
        ser.save()

    return Response(ser.data)


@api_view(['DELETE'])
def taskDelete(request, pk):

    task = Task.objects.get(id=pk)

    task.delete()

    return redirect('task-list')
