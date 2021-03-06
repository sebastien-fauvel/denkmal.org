<?php

class Denkmal_Form_User extends \CM_Form_Abstract {

    protected function _initialize() {
        $this->registerField(new CM_FormField_Email(['name' => 'email']));
        $this->registerField(new CM_FormField_Text(['name' => 'username', 'lengthMin' => 2, 'lengthMax' => 15]));
        $this->registerField(new CM_FormField_Password(['name' => 'password']));

        $this->registerAction(new Denkmal_FormAction_User_Create($this));
    }

    protected function _getRequiredFields() {
        return array('email', 'username', 'password');
    }

    public function prepare(CM_Frontend_Environment $environment, CM_Frontend_ViewResponse $viewResponse) {
        parent::prepare($environment, $viewResponse);

        /** @var Denkmal_Params $params */
        $params = $this->getParams();

        if ($params->has('inviteKey')) {
            $userInvite = Denkmal_Model_UserInvite::findByKey($params->getString('inviteKey'));
            $this->getField('email')->setValue($userInvite->getEmail());
        }
    }
}
