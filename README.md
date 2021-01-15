This is a Node/Express/MongoDB REST API for social app that uses JWT authentication. Most of endpoints are protected and each registered user has their own profile, articles and
followers.



public class User {

    private String name;
    private String userName;
    private String password;
    private long phoneNo;


    public User() {
    }

    public User(String name, String userName, String password, long phoneNo) {
        this.name = name;
        this.userName = userName;
        this.password = password;
        this.phoneNo = phoneNo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(long phoneNo) {
        this.phoneNo = phoneNo;
    }

    public boolean comparePhoneNumber(User user)    {
        boolean isSamePhoneNum = false;
        return isSamePhoneNum = user.getPhoneNo() == this.phoneNo;
    }
}
	


        
