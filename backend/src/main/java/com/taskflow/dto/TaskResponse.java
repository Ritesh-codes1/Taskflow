package com.taskflow.dto;

import com.taskflow.model.TaskStatus;
import lombok.Data;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
}

