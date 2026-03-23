package com.mw.epigen.components.entities.epigram;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpigramRepository extends JpaRepository<Epigram, Long> {

    @Modifying
    @Query("UPDATE Epigram e SET e.likes = e.likes + 1 WHERE e.id = :id")
    int incrementLikes(@Param("id") long id);

    @Modifying
    @Query("UPDATE Epigram e SET e.dislikes = e.dislikes + 1 WHERE e.id = :id")
    int incrementDislikes(@Param("id") long id);

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM Epigram e WHERE e.id = :id")
    int deleteEpigram(@Param("id") long id);

    @Query("SELECT e FROM Epigram e WHERE e.author <> :author")
    List<Epigram> findAllByAuthor(@Param("author") String author);

}
