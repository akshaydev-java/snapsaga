package com.snapsage.backend.controller;

import com.snapsage.backend.model.Survey;
import com.snapsage.backend.model.SurveyResponse;
import com.snapsage.backend.repository.SurveyRepository;
import com.snapsage.backend.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    @Autowired private SurveyRepository surveyRepository;
    @Autowired private SurveyResponseRepository responseRepository;

    @Value("${app.video.storage.path}")
    private String uploadDir;

    @GetMapping
    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSurvey(@RequestBody Survey survey) {
        return ResponseEntity.ok(surveyRepository.save(survey));
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<?> uploadVideoResponse(
            @PathVariable String id,
            @RequestParam("video") MultipartFile video) {
        
        if (video.isEmpty()) return ResponseEntity.badRequest().body("Video is empty");

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String filename = UUID.randomUUID().toString() + ".webm";
            Path filepath = Paths.get(uploadDir, filename);
            Files.write(filepath, video.getBytes());

            SurveyResponse res = new SurveyResponse();
            res.setSurveyId(id);
            res.setVideoPath("/videos/" + filename);
            responseRepository.save(res);

            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping("/{id}/responses")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SurveyResponse> getResponsesForSurvey(@PathVariable String id) {
        return responseRepository.findBySurveyId(id);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSurvey(@PathVariable String id) {
        surveyRepository.deleteById(id);
        // Also delete associated responses
        List<SurveyResponse> responses = responseRepository.findBySurveyId(id);
        responseRepository.deleteAll(responses);
        return ResponseEntity.ok().build();
    }
}
