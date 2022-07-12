package root.helper;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class StaticHelperFunctions {


    /**
     * returns a map that is sorted by value with.
     * @param unsorted
     * @return sorted map by value
     * Quelle: https://stackoverflow.com/questions/109383/sort-a-mapkey-value-by-values
     */
    public static Map<String, Integer> sortMapByValue(Map<String, Integer> unsorted) {
        Map<String, Integer> sorted = unsorted.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        return sorted;
    }


    /**
     * returns a map that is sorted by value with mininmal occurence of limit
     * @param unsorted
     * @param limit
     * @return sorted map by value
     * Quelle: https://stackoverflow.com/questions/109383/sort-a-mapkey-value-by-values
     */
    public Map sortMapByValue(Map<String, Integer> unsorted, int limit) {
        Map<String, Integer> sorted = unsorted.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .filter(map -> map.getValue() >= limit)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        return sorted;
    }


}
