import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>

            <div className="home_footer ">
                <div className="home_footer-container ">
                    <div className="row ">
                        <div className="home_footer-col ">
                            <h4>company</h4>
                            <ul>
                                <li><Link to="/Aboutuss">about us</Link></li>
                                <li><Link to="# ">our services</Link></li>
                                <li><Link to="# ">privacy policy</Link></li>
                                <li><Link to="# ">affiliate program</Link></li>
                            </ul>
                        </div>
                        <div className="home_footer-col " id="home_footer-col-online-shop ">
                            <h4>get help</h4>
                            <ul>
                                <li><Link to="# ">FAQ</Link></li>
                                <li><Link to="# ">shipping</Link></li>
                                <li><Link to="# ">returns</Link></li>
                                <li><Link to="# ">order status</Link></li>
                                <li><Link to="# ">payment options</Link></li>
                            </ul>
                        </div>
                        <div className="home_footer-col ">
                            <h4>online shop</h4>
                            <ul>
                                <li><Link to="/search/seeds">seeds</Link></li>
                                <li><Link to="/search/fertilizers">fertilizers</Link></li>
                                <li><Link to="/search/pesticides">pesticides</Link></li>
                            </ul>
                        </div>
                        <div className="home_footer-col ">
                            <h4>follow us</h4>
                            <div className="social-links ">
                                 <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                   <i className="fab fa-facebook "></i>
                                </a>
                                 <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                   <i className="fab fa-twitter"></i>
                                </a>
                                <a href="https://www.instagram.com/ad1tyajk/" target="_blank" rel="noopener noreferrer">
                                   <i className="fab fa-instagram "></i>
                                </a>
                                <a href="https://www.linkedin.com/in/bathinanna/">
                                <i className="fab fa-linkedin-in "></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Footer