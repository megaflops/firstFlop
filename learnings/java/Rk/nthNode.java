// template for useful java syntax
import java.util.*;
import java.io.*;

class nthNode {
	Node head;
	class Node{
		int data;
		Node next;
		Node(int val){
		data =val;
		next=null;
		}

	}
	void printList(Node head){
		while(head != null){
		System.out.println( "Node " +head.data);
		head = head.next;
		}
	}
		 
	void printNthFromLast(int n)
    	{
		Node refPtr;
		Node headPtr;
		int count =0;
		headPtr = refPtr = head;
		if (refPtr == null)
                {
                    System.out.println(n+" is more then nodes");
                    return;
                }
		while(count < n) {
 			refPtr = refPtr.next;
			count++;
		}
		while(refPtr != null){
		 headPtr = headPtr.next;
		 refPtr  = refPtr.next;
		}
		System.out.println("result " +"Node no. " +n +" data " +headPtr.data);
	}
	void AddToList(Node head1, int data){
	     Node newNode = new Node(data);
	     Node temp = head;
	     System.out.println( "Adding list");
	     if(head ==null)
	     {
		 System.out.println( "head is null");
		  head = newNode;
	     }
	     else{
	     while(temp.next != null){
		    temp = temp.next;
	     }
	     temp.next = newNode;
	     }
	}
	public static void main(String [] args)
    	{
	   nthNode list = new nthNode();
	   list.head = null;
	   list.AddToList(list.head,10);
	   list.AddToList(list.head,20);
	   list.AddToList(list.head,30);
	   list.AddToList(list.head,40);
	   list.printList(list.head);
	   list.printNthFromLast(4);

	}


}
