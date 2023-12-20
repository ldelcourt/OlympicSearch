import React, { useState } from "react";
import { useEffect } from "react";


import './team.css';
import { FecthResult, SearchQueryResult } from "../../interfaces";
import TableauVignettes from "../../Component/tableauVignette";
import { VignetteProps } from "../../Component/vignette";



function Team() {
    
    const thibautChantrel: VignetteProps = {
        description: "Etudiant en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925027",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Image%20Thibaut%20Chantrel%20CV%202023.jpg",
        title: "Thibaut Chantrel (4IF)",
        type: 'Athlète',
    };
    
    const gregoireMuller: VignetteProps = {
        description: "Etudiant en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925158",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Photo%20Linkedin%20Gr%C3%A9goire%20Muller.jpg",
        title: "Grégoire Muller (4IF)",
        type: 'Athlète',
    };
    
    const louDelcourt: VignetteProps = {
        description: "Etudiant en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925118",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Lou%20Delcourt%20Photo%20Linkedin.jpg",
        title: "Lou Delcourt (4IF)",
        type: 'Athlète',
    };

    const meijePigeonnat : VignetteProps = {
        description: "Etudiante en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925288",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Meije%20Pigeonnat.jpg",
        title: "Meije Pigeonnat (4IF)",
        type: 'Athlète',
    };

    const jadeLeroux : VignetteProps = {
        description: "Etudiante en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925290",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Jade%20Le%20Roux.jpg",
        title: "Jade Le Roux (4IF)",
        type: 'Athlète',
    };

    const sarahPignol : VignetteProps = {
        description: "Etudiante en 4ème annèe au sein du département de l'INSA Lyon",
        id: "Q123925298",
        imageSrc: "http://commons.wikimedia.org/wiki/Special:FilePath/Sarah%20Pignol.jpg"        ,
        title: "Sarah Pignol (4IF)",
        type: 'Athlète',
    };
    
    const teamData: VignetteProps[]  = [thibautChantrel, gregoireMuller, louDelcourt, meijePigeonnat, jadeLeroux, sarahPignol]
    
    return (
        <div className="sport-container">
            <h1>Notre Équipe</h1>
            <TableauVignettes initialVignettes={teamData} />
        </div>
    );
}

export default Team;
