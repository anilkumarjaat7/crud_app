package com.taskapp.task;

import jakarta.validation.constraints.NotBlank;

public record TaskRequest(
        @NotBlank(message = "Title required hai") String title,
        @NotBlank(message = "Description required hai") String description
) {
}
