import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { PortalInner } from "./portal.component";

export const toast = (children: ReactNode, duration: number = 3000) => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    
    ReactDOM.render(
        <PortalInner>
            <div className="toast fade-in">{children}</div>
        </PortalInner>,
        div
    )

    setTimeout(() => {
        ReactDOM.unmountComponentAtNode(div)
        document.body.removeChild(div)
    }, duration)
}