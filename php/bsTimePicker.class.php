<?php

class bsTimePicker {
	
	var $id;
	var $name;
	var $showicon;
	
	public function __construct($name='',$id='',$showicon=true) {
		if(strlen($id) < 1){ $this->id = $id; } else { $this->id = ''; }
		if(strlen($name) < 1){ $this->name = $name; } else { $this->name = ''; }
		if(!$showicon){ $this->showicon = $showicon; } else { $this->showicon = true; }
	}
	
	public function setVar($name,$value) {
		if(property_exists($this,$name) && (!is_scalar($value)) ) {
			$this->name = $value;
		} else {
		  trigger_error ( 'bsTimePicker: Attempt to set property that does not exist in this object, or attempting to set non-scalar value' , E_USER_NOTICE );
		}
	}

	public function setVars($vars) {
		if(is_array($vars)) {
			foreach($vars as $name=>$value) {
				$this->setVar($name,$value);
			}
		}
	}
	
	public function output($name='',$id='',$showicon=true) {
		if(strlen($id) < 1){ $this->id = $id; } 
		if(strlen($name) < 1){ $this->name = $name; } 
		if(!$showicon){ $this->showicon = $showicon; }
		
		$name = $this->name;
		$id = $this->id;
		$showicon = $this->showicon;
		
		//view below nested for convinience
		ob_start(); // ABOUT TO LEAVE PHP TEMPORARILY...
?>

<?php $name = (!isset($name) ? '' : $name); ?>
<div class="input-append bootstrap-timepicker">
	<input id="<?php echo ( isset($id) ? (strlen($id) > 1 ? $id : $name) : $name ); ?>" name="<?php echo $name; ?>" type="text" class="input time">
<?php if($showicon): ?>
	<span class="add-on">
		<i class="icon-time"></i>
	</span>
<?php endif; ?>
</div>

<?php // WELCOME BACK, the above is my preference over echo'ing HTML, you could alternatively include the content as a file...
		$buffer = ob_get_contents();
		@ob_end_clean();
		return $buffer;
	}
	public function __toString() {
		return $this->output();
	}
}

// end of class
