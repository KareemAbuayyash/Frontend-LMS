package com.example.lms.audit;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemActivityRepository
    extends JpaRepository<SystemActivityEntity, Long> {

  List<SystemActivityEntity> findAllByOrderByTimestampDesc(Pageable pageable);

}
