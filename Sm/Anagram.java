import java.util.*;
import java.io.*;

class Anagram {

    public static void main(String[] args) {
        System.out.println("Hi");
        String word = "Abc";
        String anaStr = "cba";

        if(isAnagram(word.toLowerCase(). toCharArray(),anaStr.toLowerCase().toCharArray())) {
            System.out.printf("%s is a Anagram of %s", word,anaStr);
        
        }
        else {
            System.out.printf("%s is NOT a Anagram of %s", word,anaStr);

        }
    }

    public static boolean isAnagram(char[] word,char[] anaStr) {
        List<Character> anaStrlst = new  ArrayList<Character>();
        for (char value : anaStr) {
            anaStrlst.add(Character.valueOf(value));
        }

        
        for (char ch : word) {
            if(anaStrlst.contains(ch)) {
                anaStrlst.remove(anaStrlst.lastIndexOf(ch));
            }
            
        }
        if(anaStrlst.size() ==0) {
        return true;
        }
        return false;
    }

}