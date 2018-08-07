import static java.lang.Math.PI;
import static java.lang.Math.sqrt;
import static java.lang.Math.acos;


class Triangles {
    static class Point {
        int x;
        int y;

        Point(int _x,int _y) {
            this.x = _x;
            this.y = _y;
        }
    }

    public static void main(String[] args) {
        System.out.println("Hi");
        Point A = new Point(0,0);
        Point B = new Point(0,1);
        Point C = new Point(1,0);

        float a1 = lengthBetweenPoints(A,B);
        float b1 = lengthBetweenPoints(B,C);
        float c1 = lengthBetweenPoints(A,C);
        
        boolean isValid = isValidTriangle(a1,b1,c1);
        if(isValid) {
            System.out.println(" The points are valid triangle");
        }
        else {
            System.out.println(" The points are NOT valid triangle");
        }

        printTriangleName(a1,b1,c1); 
        
    }

    public static void printTriangleName(float a,float b,float c) {
        // Calculate Angle
        float a2 = a*a;
        float b2= b*b;
        float c2= c*c;
        float x = (float) acos((b2 + c2 - a2)/(2*b*c));
        float y = (float) acos((a2 + c2 - b2)/(2*a*c));
        float z = (float) acos((a2 + b2 - c2)/(2*a*b));
        
        int xd = (int) Math.round(x * 180 / PI);
        int yd = (int) Math.round(y * 180 / PI);
        int zd = (int) Math.round(z * 180 / PI);

        if(xd ==90 || yd==90 || zd==90) {
            System.out.printf(" Right Angle triangle");
        }
        else if( xd == yd == zd) {
            System.out.printf(" Equilateral triangle");
        }
        else if( xd == yd || yd == zd || xd== zd) {
            System.out.printf(" Isosceles triangle ");
        }
        else if( xd <  90 && yd < 90 && xd < 90) {
            System.out.printf(" Acute triangle ");
        }
        else if( xd >  90 || yd > 90 || xd < 90) {
            System.out.printf(" Obtuse triangle ");
        }

        
        System.out.printf("\n The angles are %d %d %d", xd,yd,zd);

    }

    public static float lengthBetweenPoints(Point A,Point B) {
        int xDiff = A.x- B.x;
        int yDiff = A.y - B.y;

        return (float) sqrt(xDiff*xDiff + yDiff*yDiff);
    }

    public static boolean isValidTriangle(float a, float b, float c) {
        // check condition
        if (a + b <= c || a + c <= b || b + c <= a)
            return false;
        else
            return true;
    }
}