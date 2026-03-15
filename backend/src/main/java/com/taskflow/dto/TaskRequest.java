package com.taskflow.dto;

import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private TaskStatus status;
}

