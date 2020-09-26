import React from 'react';

export default class Info extends React.Component {
    state = {
        userData: {},
    }
    componentDidMount() {
        const ud = JSON.parse(localStorage.getItem('skychatUserData'))
        if (ud) this.setState({ userData: ud });
    }

    render() {
        return this.props.info ? <div className="con">
            <h5>
                <i className="fad fa-info-circle text-primary mr-3" />
                Profile Info
                </h5>

            {this.props.info.bio && <div className="list" >
                <i className="fal fa-book-user" /> <span>{this.props.info.bio}</span>
            </div>}
            {this.props.info.email && <div className="list" >
                <i className="fal fa-envelope" /> <a href={'mailto:' + this.props.info.email} >{this.props.info.email}</a>
            </div>}
            {this.props.info.phone && <div className="list" >
                <i className="fal fa-phone" /> <a href={'tel:' + this.props.info.phone} >{this.props.info.phone}</a>
            </div>}
            {this.props.info.address && <div className="list" >
                <i className="fal fa-map-marker-alt" /> <span>{this.props.info.address}</span>
            </div>}


            <style jsx>{`
            .con {
                    box-shadow: 0 0px 3px 2px #0001;
            background : var(--white);
            padding : 20px;
            }
            .list {
                padding : 5px;
            }
            .list > * {
                color : var(--dark);
                font-weight : 500
            }
            .list i {
                color : #f209;
                margin-right : 10px
            }
            `}</style>
        </div> : null
    }
}