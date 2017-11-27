<template>
    <div class="feature-tree" ref="featureTree">
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';

export default {
    props: {
        featureData: Object,
        context: Object,
        loading: false
    },
    data() {
        return {
            $tree: null,
            features: null,
            createdTreeBefore: false
        };
    },
    created() {
        // 向父组件传递当前组件对象，方便调用当前组件里面的方法，属性。
        this.$emit('update:context', this);
    },
    mounted() {
        this.$tree = $(this.$refs.featureTree);
    },
    watch: {
        featureData(val) {
            this.features = val;
            console.log('featureData');
            this.refreshTree();
            // 只有当PremissionTree加载完毕后，才可以将父组件的loading设置为FALSE
            this.$emit('update:loading', false);
        }
    },
    methods: {
        findFeatureByName(featureName) {
            const self = this;
            const feature = _.find(
                self.features.features,
                f => f.name === featureName
            );

            if (!feature) {
                abp.log.warn(
                    'Could not find a feature by name: ' + featureName
                );
            }

            return feature;
        },
        findFeatureValueByName(featureName) {
            const self = this;
            const feature = self.findFeatureByName(featureName);
            if (!feature) {
                return '';
            }

            const featureValue = _.find(
                self.features.featureValues,
                f => f.name === featureName
            );
            if (!featureValue) {
                return feature.defaultValue;
            }

            return featureValue.value;
        },
        isFeatureValueValid(featureName, value) {
            const self = this;
            const feature = self.findFeatureByName(featureName);
            if (
                !feature ||
                !feature.inputType ||
                !feature.inputType.validator
            ) {
                return true;
            }

            const validator = feature.inputType.validator;
            if (validator.name === 'STRING') {
                if (value === undefined || value === null) {
                    return validator.allowNull;
                }

                if (typeof value !== 'string') {
                    return false;
                }

                if (
                    validator.minLength > 0 &&
                    value.length < validator.minLength
                ) {
                    return false;
                }

                if (
                    validator.maxLength > 0 &&
                    value.length > validator.maxLength
                ) {
                    return false;
                }

                if (validator.regularExpression) {
                    return new RegExp(validator.regularExpression).test(value);
                }
            } else if (validator.name === 'NUMERIC') {
                const numValue = parseInt(value);

                if (isNaN(numValue)) {
                    return false;
                }

                const minValue = validator.minValue;
                if (minValue > numValue) {
                    return false;
                }

                const maxValue = validator.maxValue;
                if (maxValue > 0 && numValue > maxValue) {
                    return false;
                }
            }

            return true;
        },
        areAllValuesValid() {
            const self = this;
            self.$tree.find('.jstree-node').each(function() {
                const $nodeLi = $(this);
                const featureName = $nodeLi.attr('id');
                const feature = self.findFeatureByName(featureName);

                if (
                    feature &&
                    (!feature.inputType ||
                        feature.inputType.name === 'CHECKBOX')
                ) {
                    const value = self.$tree.jstree('is_checked', $nodeLi)
                        ? 'true'
                        : 'false';
                    self.setFeatureValueByName(featureName, value);
                }
            });

            return self.$tree.find('.feature-tree-textbox-invalid').length <= 0;
        },
        setFeatureValueByName(featureName, value) {
            const featureValue = _.find(
                this.features.featureValues,
                f => f.name === featureName
            );
            if (!featureValue) {
                return;
            }

            featureValue.value = value;
        },
        getFeatureValueByName(featureName) {
            const featureValue = _.find(
                this.features.featureValues,
                f => f.name === featureName
            );
            if (!featureValue) {
                return null;
            }

            return featureValue.value;
        },
        isFeatureEnabled(featureName) {
            const self = this;
            const value = self.findFeatureValueByName(featureName);
            return value.toLowerCase() === 'true';
        },
        customizeTreeNodes() {
            const self = this;
            self.$tree.find('.jstree-node').each(function() {
                const $nodeLi = $(this);
                const $nodeA = $nodeLi.find('.jstree-anchor');

                const featureName = $nodeLi.attr('id');
                const feature = self.findFeatureByName(featureName);
                const featureValue =
                    self.findFeatureValueByName(featureName) || '';

                if (!feature || !feature.inputType) {
                    return;
                }

                if (feature.inputType.name === 'CHECKBOX') {
                    // no change for checkbox
                } else if (feature.inputType.name === 'SINGLE_LINE_STRING') {
                    if (!$nodeLi.find('.feature-tree-textbox').length) {
                        $nodeA.find('.jstree-checkbox').hide();

                        let inputType = 'text';
                        const validator = feature.inputType.validator;
                        if (feature.inputType.validator) {
                            if (
                                feature.inputType.validator.name === 'NUMERIC'
                            ) {
                                inputType = 'number';
                            }
                        }

                        const $textbox = $(
                            '<input class="feature-tree-textbox" type="' +
                                inputType +
                                '" />'
                        ).val(featureValue);

                        if (inputType === 'number') {
                            $textbox.attr('min', validator.minValue);
                            $textbox.attr('max', validator.maxValue);
                        } else {
                            if (
                                feature.inputType.validator &&
                                feature.inputType.validator.name === 'STRING'
                            ) {
                                if (validator.maxLength > 0) {
                                    $textbox.attr(
                                        'maxlength',
                                        validator.maxLength
                                    );
                                }
                                if (validator.minLength > 0) {
                                    $textbox.attr('required', 'required');
                                }
                                if (validator.regularExpression) {
                                    $textbox.attr(
                                        'pattern',
                                        validator.regularExpression
                                    );
                                }
                            }
                        }

                        $textbox.on('input propertychange paste', () => {
                            const value = $textbox.val();
                            if (self.isFeatureValueValid(featureName, value)) {
                                self.setFeatureValueByName(featureName, value);
                                $textbox.removeClass(
                                    'feature-tree-textbox-invalid'
                                );
                            } else {
                                $textbox.addClass(
                                    'feature-tree-textbox-invalid'
                                );
                            }
                        });

                        $textbox.appendTo($nodeLi);
                    }
                } else if (feature.inputType.name === 'COMBOBOX') {
                    if (!$nodeLi.find('.feature-tree-combobox').length) {
                        $nodeA.find('.jstree-checkbox').hide();

                        const $combobox = $(
                            '<select class="feature-tree-combobox" />'
                        );
                        const inputType = feature.inputType;
                        _.each(inputType.itemSource.items, opt => {
                            $('<option></option>')
                                .attr('value', opt.value)
                                .text(opt.displayText)
                                .appendTo($combobox);
                        });

                        $combobox
                            .val(featureValue)
                            .on('change', () => {
                                const value = $combobox.val();
                                self.setFeatureValueByName(featureName, value);
                            })
                            .appendTo($nodeLi);
                    }
                }
            });
        },
        getNodeLiByFeatureName(featureName) {
            return $('#' + featureName.replace('.', '\\.'));
        },
        selectNodeAndAllParents(node) {
            const self = this;
            self.$tree.jstree('select_node', node, true);
            const parent = self.$tree.jstree('get_parent', node);
            if (parent) {
                self.selectNodeAndAllParents(parent);
            }
        },
        getGrantedFeatures() {
            if (!this.$tree || !this.createdTreeBefore) {
                return [];
            }

            const selectedFeatures = this.$tree.jstree('get_selected', true);

            return _.map(this.features.features, item => {
                const feature = {};
                feature.name = item.name;
                if (!item.inputType || item.inputType.name === 'CHECKBOX') {
                    feature.value = _.some(selectedFeatures, {
                        original: { id: item.name }
                    })
                        ? 'true'
                        : 'false';
                } else {
                    feature.value = this.getFeatureValueByName(item.name);
                }

                return feature;
            });
        },
        refreshTree() {
            const self = this;
            var $tree = this.$tree;
            if (this.createdTreeBefore) {
                $tree.jstree('destroy');
            }

            this.createdTreeBefore = false;

            if (!this.features || !$tree) {
                return;
            }
            console.log(this.features);
            let treeData = _.map(this.features.features, function(item) {
                return {
                    id: item.name,
                    parent: item.parentName ? item.parentName : '#',
                    text: item.displayName,
                    state: {
                        opened: true,
                        selected: _.some(self.features.featureValues, {
                            name: item.name,
                            value: 'true'
                        })
                    }
                };
            });

            this.createdTreeBefore = true;
            let inTreeChangeEvent = false;

            $tree
                .jstree({
                    core: {
                        data: treeData
                    },
                    types: {
                        default: {
                            icon: 'fa fa-folder tree-item-icon-color icon-lg'
                        },
                        file: {
                            icon: 'fa fa-file tree-item-icon-color icon-lg'
                        }
                    },
                    checkbox: {
                        keep_selected_style: false,
                        three_state: false,
                        cascade: ''
                    },
                    plugins: ['checkbox', 'types']
                })
                .on('ready.jstree', () => {
                    self.customizeTreeNodes();
                })
                .on('redraw.jstree', () => {
                    self.customizeTreeNodes();
                })
                .on('after_open.jstree', () => {
                    self.customizeTreeNodes();
                })
                .on('create_node.jstree', () => {
                    self.customizeTreeNodes();
                })
                .on('changed.jstree', (e, data) => {
                    if (!data.node) {
                        return;
                    }

                    const wasInTreeChangeEvent = inTreeChangeEvent;
                    if (!wasInTreeChangeEvent) {
                        inTreeChangeEvent = true;
                    }

                    let childrenNodes;

                    if (data.node.state.selected) {
                        self.selectNodeAndAllParents(
                            $tree.jstree('get_parent', data.node)
                        );

                        childrenNodes = $.makeArray(
                            $tree.jstree('get_children_dom', data.node)
                        );
                        $tree.jstree('select_node', childrenNodes);
                    } else {
                        childrenNodes = $.makeArray(
                            $tree.jstree('get_children_dom', data.node)
                        );
                        $tree.jstree('deselect_node', childrenNodes);
                    }

                    if (!wasInTreeChangeEvent) {
                        const $nodeLi = self.getNodeLiByFeatureName(
                            data.node.id
                        );
                        const feature = self.findFeatureByName(data.node.id);
                        if (
                            feature &&
                            (!feature.inputType ||
                                feature.inputType.name === 'CHECKBOX')
                        ) {
                            const value = $tree.jstree('is_checked', $nodeLi)
                                ? 'true'
                                : 'false';
                            self.setFeatureValueByName(data.node.id, value);
                        }

                        inTreeChangeEvent = false;
                    }
                });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.feature-tree-textbox.feature-tree-textbox-invalid {
    // background: #f00;
    border: 1px solid #f00;
    // color: white;
    outline: none;
}

.feature-tree-combobox,
.feature-tree-textbox {
    margin: 2px 0 2px 5px;
    display: inline-block;
    padding: 4px 6px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -webkit-transition: border-color ease-in-out 0.15s,
        -webkit-box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.feature-tree a.jstree-anchor {
    margin-top: 4px;
}
</style>