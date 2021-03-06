import {Component, h} from 'preact';

import {Link} from 'preact-router/match';
import {Page} from './page';

export class HomePage extends Page<any, any> {
  async componentDidMount() {
    document.title = 'Fileset';
  }

  render() {
    return (
      <div class="HomePage">
        <div class="HomePage__title">Sites</div>
        <div class="HomePage__sites">
          <div class="HomePage__sites__site">
            <Link
              class="HomePage__sites__site__name"
              href="/fileset/sites/default"
            >
              Default
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
