package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponse> getCurrentUserTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse createTask(TaskRequest request) {
        User user = getCurrentUser();
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .user(user)
                .build();
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        User user = getCurrentUser();
        Task existing = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setStatus(request.getStatus());

        return toResponse(taskRepository.save(existing));
    }

    public void deleteTask(Long id) {
        User user = getCurrentUser();
        Task existing = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        taskRepository.delete(existing);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        return response;
    }
}

