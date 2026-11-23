package com.taskapp.task;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class TaskController {
    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody TaskRequest request) {
        return taskRepository.save(new Task(request.title().trim(), request.description().trim()));
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setTitle(request.title().trim());
        task.setDescription(request.description().trim());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }
}
