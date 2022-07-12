package root.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tudarmstadt.ukp.dkpro.core.api.ner.type.NamedEntity;
import de.tudarmstadt.ukp.dkpro.core.api.segmentation.type.Token;
import lombok.*;

import org.apache.uima.fit.factory.JCasFactory;
import org.apache.uima.fit.util.JCasUtil;
import org.apache.uima.jcas.JCas;
import org.apache.uima.util.XmlCasDeserializer;

import java.io.InputStream;
import java.io.FileInputStream;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.*;

import org.apache.uima.UIMAException;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.xml.sax.SAXException;
import root.entities.sub.UimaEntitiy;
import root.entities.sub.UimaType;

import static java.util.Map.entry;


/**
 * entity for one uima document
 */
@Data
@Document(collection = "uimadocuments")
public class UimaDocument {

    @JsonIgnore
    @Transient // ignoriere jcas in api und mongodb
    private JCas jCas;
    @Id
    private String id;

    private List<UimaEntitiy> entities = new ArrayList<>();
    private List<UimaEntitiy> pos = new ArrayList<>();

    //zukunft
    private Map<String, Object> types;


    /**
     * @throws UIMAException
     * @throws IOException
     * @throws SAXException
     */
    public UimaDocument() throws UIMAException, IOException, SAXException {

        //  deserialization of jcas from xmi. All information of document is stored in jcas.
        this.jCas = JCasFactory.createJCas();
        InputStream inputStream = null;
        try {
            // ändern
            inputStream = new FileInputStream("C:\\Users\\vedat\\OneDrive\\Desktop\\Bachelorarbeit\\Bachelorarbeit_projekt\\uima-dynamic-visualizer-ba\\server\\src\\main\\resources\\data\\gercorpus-test.xmi");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        XmlCasDeserializer.deserialize(inputStream, this.jCas.getCas(), true);


        // extract all information
        this.extractTest();
        this.extractPos();

        this.types = Map.ofEntries(entry("pos", this.pos), entry("entities", this.entities));


    }


    /**
     * Noch am Testen. Soll für generic Type möglich sein. (Nicht nur NamedEntity)
     */

    public void extractTest() {
        for (NamedEntity namedEntity : JCasUtil.select(this.jCas, NamedEntity.class)) {

            UimaEntitiy uimaEntitiy = new UimaEntitiy(
                    namedEntity.getValue(),
                    namedEntity.getCoveredText(),
                    namedEntity.getBegin(),
                    namedEntity.getEnd()

            );

            this.entities.add(uimaEntitiy);
        }
    }


    public void extractPos() {
        for (Token token : JCasUtil.select(this.jCas, Token.class)) {

            UimaEntitiy uimaEntitiy = new UimaEntitiy(
                    token.getPosValue(),
                    token.getCoveredText(),
                    token.getBegin(),
                    token.getEnd()
            );

            this.pos.add(uimaEntitiy);
        }
    }

}
