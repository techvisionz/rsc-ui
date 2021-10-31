import { Component } from "react";
import { withTranslation } from "react-i18next";


class Test extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <div>{t('name')}</div>
    );
  }
}

export default withTranslation()(Test);



