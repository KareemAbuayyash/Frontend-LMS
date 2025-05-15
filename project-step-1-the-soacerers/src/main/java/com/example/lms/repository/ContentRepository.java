package com.example.lms.repository;

import com.example.lms.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByCourseId(Long courseId);

    @Modifying @Transactional
@Query("DELETE FROM Content c WHERE c.course.id = :courseId")
void deleteByCourseId(@Param("courseId") Long courseId);

}
