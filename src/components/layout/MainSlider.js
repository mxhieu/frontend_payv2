import React, { Component } from 'react';
import { connect } from 'react-redux';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import sliderActions from "../../actions/slider.actions";

class MainSlider extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            sliders: this.props.sliders
        }
    }

    componentDidMount(){
        this.props.getAllRequest();
    }

    render() {
        var { sliders } = this.props;
        return (
            <div>
                {
                    sliders.length > 0 
                    ?
                    <OwlCarousel
                        className="owl-theme"
                        loop
                        items={1}
                    >
                        {sliders.map((val, index) => (
                            <div className="main_slide_item" key={index}>
                                <a target="blank" rel="noopener noreferrer" href={val.link}>
                                    <img className="img-responsive" alt={val.image} src={val.image} />
                                </a>
                            </div>
                        ))}
                    </OwlCarousel>
                    :
                    null
                }   
            </div>
           
        )
    }
}

const mapStateToProps = (state) => ({
    sliders: state.sliderReducer
})

const mapDispatchToProps = (dispatch, props) => {
    return {
        getAllRequest: () => {
            dispatch(sliderActions.getAllRequest())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSlider)