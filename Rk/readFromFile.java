import java.io.File;
import java.util.Scanner;
public class readFromFile
{
  public static void main(String[] args) throws Exception
  {
    // pass the path to the file as a parameter
    File file = new File("test.txt");
    Scanner fp = new Scanner(file);
    Scanner fp1 = new Scanner(file);
    int count = 3,readCount=0;
     System.out.println("Num of line to be read from EOF " +count);
 
    while (readCount < count){
	  if(fp.hasNextLine()){
	     fp.nextLine();
	    //System.out.println(fp.nextLine());
	    readCount++;
           }
	  else{
	    System.out.println("file has less number of lined then intended");
	  }
     }
    System.out.println("##Point reached##");
    while (true){
	  if(fp.hasNextLine()){
		fp.nextLine();  
		if(fp1.hasNextLine()){
	    	    fp1.nextLine();
		}
		else{
		System.out.println("Wrong:: fp1 EOF");
		break;
		}

	   }
	  else{
	    System.out.println(" ##fp EOF reached##");
	    break;
	  }
     }
    System.out.println("##Point reached 2 ##");
    while(true) {
	if(fp1.hasNextLine()){
	    System.out.println(fp1.nextLine());
	}
        else{
	    System.out.println("fp1 EOF reachedd");
	    break;
	}

    }
 }
}
