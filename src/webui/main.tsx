import {Component, h, render} from 'preact';
import {Router, route} from 'preact-router';

import {BuildPage} from './pages/buildpage';
import {HomePage} from './pages/homepage';
import {SitePage} from './pages/sitepage';
import {TopBar} from './components/topbar';

interface MainState {
  currentPath: string;
}

class Main extends Component<unknown, MainState> {
  constructor() {
    super();
    this.state = {
      currentPath: window.location.pathname,
    };
  }

  onRouteChange() {
    if (window.location.pathname !== this.state.currentPath) {
      this.setState({
        currentPath: window.location.pathname,
      });
      console.log('onRouteChange');
    }
  }

  render() {
    return (
      <div class="Main">
        <TopBar />
        <div class="Main__content">
          <Router onChange={this.onRouteChange.bind(this)}>
            <HomePage path="/fileset/" />
            <SitePage path="/fileset/sites/:siteId" />
            <BuildPage path="/fileset/sites/:siteId/:ref" />
          </Router>
        </div>
      </div>
    );
  }
}

const container = document.querySelector('.webui');
render(<Main />, container);
