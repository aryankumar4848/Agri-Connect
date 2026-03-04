import "./AboutUs.css";

function AboutUs() {
    return (
        <div className="AboutUs_body">

            <div className="about_main_div">
                <div className="section">
                    <div className="container">
                        <div className="content-section">
                            <div className="title">
                                <h1>About Us</h1>
                            </div>
                            <div className="content">
                                <h3>One Stop For all Farmers!</h3>
                                <p>
                                    Our Website Major Motto is to Help Farmers in a very unique way.
                                    Our website consists of five major sections namely Crop
                                    Suggestion section, Discussions Tab, Market Place for Farmers,
                                    Login for better services and lastly Chatbot for further
                                    assistance. For better understanding of the five major
                                    sections.
                                    <br />
                                    Firstly, Crop Suggestion section the page takes inputs and
                                    displays the best possible crops and their full-fledged details
                                    such as Season suitable for the crop, minimal investment, water
                                    availability, Gross income and total profit earned. This helps
                                    the Farmers to have a better understanding of professional
                                    farming.
                                    <br />
                                    The website contains a Discussion tab in which Farmers can post
                                    their queries and other farmers or experts might help them by 
                                    posting solutions.
                                    <br />
                                    The other section of our website and center of attraction is
                                    the MarketPlace. Farmers can have all the products at one place
                                    which are required at a very minimal price. Machinery, seeds,
                                    fertilizers, pesticides are some basic examples.
                                    <br />
                                    For Better Services Farmers need to login to the website for
                                    more assistance.
                                    <br />
                                    Lastly, the Chatbot helps users with instant assistance.
                                </p>
                            </div>

                            <div className="social">
                                <a href="#"><i className="fab fa-facebook-f"></i></a>
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="image-section">
                            <img src="./AboutUs_Images/aboutusimg.jpg" alt="About Us" />
                            
                        </div>
                    </div>
                </div>

                <div className="container-1 AboutContainer">
                    <div className="AboutUs_carousel">
                        
                        <div className="AboutUs_carousel__face">
                            <img src="./AboutUs_Images/Bathinanna.png" alt="Bathinanna" />
                        </div>
                        <div className="AboutUs_carousel__face">
                            <img src="./AboutUs_Images/jk.png" alt="JK" />
                        </div>
                    </div>
                </div>

                <div className="names-div">
                    <div className="names">
                        <span>Developed by:</span><br /> 
                        <span>Bathinanna</span><br />
                         <span>Aditya JK</span><br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
