package test;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class TestClass {

    public static void main(String[] args){
        TestClass testClass = new TestClass(123, "ja", "nein");
        System.out.println(testClass.getFirtName());
    }

    private long id;
    private String lastName;
    private String firtName;

    public TestClass(long id, String lastName, String firtName) {
        this.id = id;
        this.lastName = lastName;
        this.firtName = firtName;
    }
}

