public class Main {
    public static int Sunday = 1;
    public static int weekcal(long year, long month, long day){
        if (month <= 2){
            month += 12;
            year--;
        }
        //WEEK DAY CALCULATION
        return (int)(day + 13 * (month+1)/5 + year + year/4 - year/100 + year/400)% 7;
    }
    public static void main(String[] args){
        long y1 = 2000, y2 = 2020;
        long m1=1, m2=1, d1=1, d2=1;
        if (y2 < y1 || (y2 == y1 && m2 < m1)){
            //SWAP MONTH AND YEAR
            long temp=y2;
            y2=y1;
            y1=temp;
            temp=m2;
            m2=m1;
            m1=temp;
        }

        long year  = y1;
        long month = m1;
        if (d1 > 1){
            //NEXT MONTH  AS 1 date is passed
            month++;
            if (month > 12){
                month = month - 12;
                year++;
            }
        }

        long sum = 0;

        while (year + 2800 < y2){
            //Calendar Repeats in 2800 Years
            year = year + 2800;
            sum = sum + 4816;
        }
        while (month < m2 || year < y2){
            if (weekcal(year, month, 1) == Sunday){
                sum++;
            }
            month++;
            if (month > 12){
                month -= 12;
                year++;
            }
        }
        if (weekcal(year, month, 1) == Sunday){
            sum++;
        }
        System.out.println("Total Sundays on Date 1 between "+y1+" and "+y2+" are : "+sum);
    
    }
}

