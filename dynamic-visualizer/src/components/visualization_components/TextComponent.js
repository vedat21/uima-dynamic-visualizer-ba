import React from "react";

// Custom Modules
import useGetData from "./scripts/useGetData"

/**
 * component to display a text
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TextComponent(props) {

    //   const url = `http://localhost:9999/result/text`
    //   const data = useGetData(url);

    return (
        <div className="scrollable-text-wrapper">
        <span>
            Die Liste der Äbte und Administratoren der Abtei Hersfeld umfasst alle 66 Äbte, die der Reichs­abtei
            Hers­feld wäh­rend ihrer Exis­tenz als Bene­diktiner­abtei von 769 bis 1606 vorge­standen haben, sowie
            alle
            von 1606 bis 1648 amtieren­den Admi­nistra­toren des Reichs­stifts. Abtei­gründer und erster Abt war der
            Mainzer Bischof Lullus. Die Hersfel­der Äbte waren als Bera­ter und Gesandte der Herr­scher tätig und
            standen ihnen in ihren Konflik­ten mit dem Papst­tum zur Seite. Dem Ende der Staufer, denen die Äbte
            eben­falls treu gedient hatten, folgte ein erheb­licher Bedeu­tungs- und Macht­verlust der Abtei. Die
            durch
            Luther ausge­löste Reforma­tion fand in Hers­feld begeis­terte Auf­nahme. Schnell wurden weite Teile der
            Bevölke­rung und des Kon­vents der Abtei evange­lisch. Die Äbte konnten dem nur wenig ent­gegen­setzen
            und
            neigten teils eben­falls der evange­lischen Lehre zu. Der letzte Abt setzte schließ­lich vor seinem Tod
            einen Sohn des Land­grafen als Koadju­tor ein, der 1606 die Herr­schaft im Stifts­gebiet als
            Adminis­trator
            über­nahm. Mit dem Westfä­lischen Frieden kam das Reichs­stift als welt­liches Fürsten­tum Hers­feld
            endgül­tig an
        </span>
        </div>
    )
}

export default TextComponent;

